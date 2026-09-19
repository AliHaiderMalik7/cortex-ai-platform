import anthropic
import chromadb
from dotenv import load_dotenv

load_dotenv()  # reads .env and puts its values into os.environ

# Reads ANTHROPIC_API_KEY from the environment automatically
claude = anthropic.Anthropic()

# Persists to backend/chroma_data/ on disk (gitignored)
chroma_client = chromadb.PersistentClient(path="./chroma_data")
documents_collection = chroma_client.get_or_create_collection("documents")
