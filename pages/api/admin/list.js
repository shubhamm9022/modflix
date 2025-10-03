import { connectToDB } from '../../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const db = await connectToDB();

    const total = await db.collection('movies').countDocuments();
    const movies = await db.collection('movies')
      .find()
      .sort({ uploaded_at: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    return res.status(200).json({ 
      movies,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Failed to fetch movies' });
  }
}
