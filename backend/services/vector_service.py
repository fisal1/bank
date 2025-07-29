import os
import json
import math
from services.embedding_service import get_embedding

DB_PATH = os.path.join(os.getcwd(), 'data', 'vector_db.json')

# Load store from file
if os.path.exists(DB_PATH):
    with open(DB_PATH, 'r') as f:
        _store = json.load(f)
else:
    _store = []


def cosine_similarity(vec1, vec2):
    dot = sum(x*y for x, y in zip(vec1, vec2))
    norm1 = math.sqrt(sum(x*x for x in vec1))
    norm2 = math.sqrt(sum(x*x for x in vec2))
    return dot / (norm1 * norm2) if norm1 and norm2 else 0


async def save_chunks(chunks, tag, version, filename):
    """
    Save chunks with embeddings in a JSON file.
    """
    global _store
    for text in chunks:
        emb = await get_embedding(text)
        _store.append({
            "text": text,
            "tag": tag,
            "version": version,
            "filename": filename,
            "embedding": emb
        })

    with open(DB_PATH, 'w') as f:
        json.dump(_store, f, indent=2)


async def query_chunks(query, top_k=3):
    """
    Compute cosine similarity between query embedding and stored embeddings.
    Skip any entries without 'embedding'.
    """
    q_emb = await get_embedding(query)

    results = []
    for item in _store:
        if "embedding" not in item:
            continue  # skip old entries
        sim = cosine_similarity(q_emb, item["embedding"])
        results.append((sim, item))

    results.sort(key=lambda x: x[0], reverse=True)
    return [item for _, item in results[:top_k]]
