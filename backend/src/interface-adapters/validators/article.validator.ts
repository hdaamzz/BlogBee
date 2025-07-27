import Joi from 'joi';

export const createArticleSchema = Joi.object({
  title: Joi.string()
    .min(5)
    .max(200)
    .required()
    .messages({
      'string.min': 'Title must be at least 5 characters long',
      'string.max': 'Title must not exceed 200 characters',
      'any.required': 'Title is required'
    }),
  excerpt: Joi.string()
    .min(20)
    .max(500)
    .required()
    .messages({
      'string.min': 'Excerpt must be at least 20 characters long',
      'string.max': 'Excerpt must not exceed 500 characters',
      'any.required': 'Excerpt is required'
    }),
  content: Joi.string()
    .min(50)
    .required()
    .messages({
      'string.min': 'Content must be at least 50 characters long',
      'any.required': 'Content is required'
    }),
  tags: Joi.array()
    .items(Joi.string().trim())
    .max(10)
    .default([])
    .messages({
      'array.max': 'Maximum 10 tags allowed'
    })
});

export const updateArticleSchema = Joi.object({
  title: Joi.string()
    .min(5)
    .max(200)
    .optional()
    .messages({
      'string.min': 'Title must be at least 5 characters long',
      'string.max': 'Title must not exceed 200 characters'
    }),
  excerpt: Joi.string()
    .min(20)
    .max(500)
    .optional()
    .messages({
      'string.min': 'Excerpt must be at least 20 characters long',
      'string.max': 'Excerpt must not exceed 500 characters'
    }),
  content: Joi.string()
    .min(50)
    .optional()
    .messages({
      'string.min': 'Content must be at least 50 characters long'
    }),
  tags: Joi.array()
    .items(Joi.string().trim())
    .max(10)
    .optional()
    .messages({
      'array.max': 'Maximum 10 tags allowed'
    }),
  isPublished: Joi.boolean().optional()
});

export const searchArticleSchema = Joi.object({
  q: Joi.string()
    .min(1)
    .required()
    .messages({
      'string.min': 'Search query cannot be empty',
      'any.required': 'Search query is required'
    })
});
