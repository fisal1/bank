from services.vector_service import query_chunks
from services.llm_service    import get_llm_answer

async def get_answer(question):
    # 0) Retrieve relevant policy chunks
    chunks = await query_chunks(question, top_k=3)

    # 1) Simple greeting detection
    q_lower = question.strip().lower()
    GREETINGS = {"hi", "hello", "hey", "good morning", "good afternoon", "good evening"}
    if q_lower in GREETINGS:
        return (
            "Hello! 👋 How can I help you with your banking policies, SOPs, or financial queries today?",
            []
        )

    # 2) If no docs retrieved, fallback to LLM
    if not chunks:
        answer = get_llm_answer(question, "")
        return answer, []

    # 3) Build context and call LLM
    context = "\n".join(c["text"] for c in chunks)
    answer  = get_llm_answer(question, context)
    sources = [f"{c['filename']} v{c['version']}" for c in chunks]
    return answer, sources
