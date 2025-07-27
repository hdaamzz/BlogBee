import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IArticleDocument extends Document {
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  slug: string;
  authorId: Types.ObjectId;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ArticleSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 200
  },
  excerpt: {
    type: String,
    required: true,
    trim: true,
    minlength: 20,
    maxlength: 500
  },
  content: {
    type: String,
    required: true,
    minlength: 50
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  authorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  publishedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes
// ArticleSchema.index({ authorId: 1 });
// ArticleSchema.index({ slug: 1 });
// ArticleSchema.index({ isPublished: 1, createdAt: -1 });
// ArticleSchema.index({ tags: 1 });
// ArticleSchema.index({ 
//   title: 'text', 
//   excerpt: 'text', 
//   content: 'text',
//   tags: 'text'
// });
// ArticleSchema.index({ authorId: 1, createdAt: -1 });

export default mongoose.model<IArticleDocument>('Article', ArticleSchema);
