import Joi from 'joi';
import { ResponseMessage } from '../../shared/constants/messages.enum';

export const registerValidationSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.empty': ResponseMessage.NAME_REQUIRED,
      'any.required': ResponseMessage.NAME_REQUIRED
    }),
  
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.empty': ResponseMessage.EMAIL_REQUIRED,
      'string.email': ResponseMessage.EMAIL_INVALID,
      'any.required': ResponseMessage.EMAIL_REQUIRED
    }),
  
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.empty': ResponseMessage.PASSWORD_REQUIRED,
      'string.min': ResponseMessage.PASSWORD_MIN_LENGTH,
      'any.required': ResponseMessage.PASSWORD_REQUIRED
    })
});


export const loginValidationSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.empty': ResponseMessage.EMAIL_REQUIRED,
      'string.email': ResponseMessage.EMAIL_INVALID,
      'any.required': ResponseMessage.EMAIL_REQUIRED
    }),
  
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.empty': ResponseMessage.PASSWORD_REQUIRED,
      'string.min': ResponseMessage.PASSWORD_MIN_LENGTH,
      'any.required': ResponseMessage.PASSWORD_REQUIRED
    })
});