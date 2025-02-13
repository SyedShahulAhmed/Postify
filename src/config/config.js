const config = {
    appwwrite_url : String(import.meta.env.VITE_APPWRITE_URL),
    appwwrite_project_id : String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
    appwwrite_db_id : String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
    appwwrite_collection_id : String(import.meta.env.VITE_APPWRITE_COLLECTION_ID),
    appwwrite_bucket_id : String(import.meta.env.VITE_APPWRITE_BUCKET_ID),
}

export default config