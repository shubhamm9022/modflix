import {connectToDB} from '../../../lib/mongodb';

export default async function handler(req,res){
  const { slug } = req.query;
  if(!slug) return res.status(400).json({error:'Missing slug'});
  try{
    const db = await connectToDB();
    const movie = await db.collection('movies').findOne({slug});
    if(!movie) return res.status(404).json({error:'Movie not found'});
    return res.status(200).json(movie);
  } catch(error){
    return res.status(500).json({error:error.message});
  }
}
