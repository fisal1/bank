def chunk_text(text, max_tokens=300, overlap=50):
    words = text.split()
    chunks = []
    i = 0
    while i < len(words):
        chunk = words[i:i+max_tokens]
        chunks.append(' '.join(chunk))
        i += max_tokens - overlap
    return chunks
