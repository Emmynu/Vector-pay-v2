import { createClient } from "@supabase/supabase-js"


export const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
)


export async function uploadFile(bucket, file, path){
    let url = null

    const { data, error } = await supabase.storage.from(bucket).upload(path, file, {upsert:true})
    
    if(data){
       const { data:URL } = supabase.storage.from(bucket).getPublicUrl(path)
       url = URL.publicUrl
    }

    return {
        error:error?.message,
        url: url
    }
}
