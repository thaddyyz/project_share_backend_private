import { AppError } from '../middleware/errorHandler.js';

export const validateRequiredFields = (body, requiredFields) => {
  const missingFields = requiredFields.filter(field => 
    body[field] === undefined || body[field] === null || body[field] === ''
  );

  if (missingFields.length > 0) {
    throw new AppError(`Missing required fields: ${missingFields.join(', ')}`, 400);
  }
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new AppError('Invalid email format', 400);
  }
};

export const validatePhone = (phone) => {
  const phoneRegex = /^\+?[\d\s-()]{10,}$/;
  if (phone && !phoneRegex.test(phone)) {
    throw new AppError('Invalid phone number format', 400);
  }
};

export const validateProfileData = (profileData) => {
  const allowedFields = [
    'display_name', 'profile_tag', 'profile_info', 'profile_image',
    'background_image', 'background_color_1', 'background_color_2',
    'profile_name', 'name_color', 'name_font', 'general_title',
    'general_image', 'general_description', 'general_heading',
    'general_sub_heading', 'status', 'visibility'
  ];

  const invalidFields = Object.keys(profileData).filter(
    field => !allowedFields.includes(field)
  );

  if (invalidFields.length > 0) {
    throw new AppError(`Invalid fields: ${invalidFields.join(', ')}`, 400);
  }

  // Validate required fields for profile creation
  if (profileData.display_name && profileData.display_name.length < 2) {
    throw new AppError('Display name must be at least 2 characters', 400);
  }

//   if (profileData.profile_tag && !['social', 'networking', 'conference'].includes(profileData.profile_tag)) {
//     throw new AppError('Profile tag must be one of: social, networking, conference', 400);
//   }

  if (profileData.status && !['unpublished', 'published'].includes(profileData.status)) {
    throw new AppError('Status must be either unpublished or published', 400);
  }

//   if (profileData.visibility && !['public', 'protected', 'private'].includes(profileData.visibility)) {
//     throw new AppError('Visibility must be one of: public, protected, private', 400);
//   }
};

export const validateAccountData = (accountData) => {
  const allowedFields = ['name', 'phone', 'subscription_type'];
  
  const invalidFields = Object.keys(accountData).filter(
    field => !allowedFields.includes(field)
  );

  if (invalidFields.length > 0) {
    throw new AppError(`Invalid fields: ${invalidFields.join(', ')}`, 400);
  }

  if (accountData.subscription_type && 
      !['trial', 'tester', 'standard', 'paid'].includes(accountData.subscription_type)) {
    throw new AppError('Invalid subscription type', 400);
  }
};

export const validateUUID = (uuid) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(uuid)) {
    throw new AppError('Invalid UUID format', 400);
  }
};

export const validateContactRequest = (body) => {
  validateRequiredFields(body, ['contact_profile_id']);
  validateUUID(body.contact_profile_id);
};

// // Enhanced decrypt function with validation
// export const safeDecrypt = (encodedData) => {
//   try {
//     if (!encodedData || typeof encodedData !== 'string') {
//       throw new AppError('Invalid encoded data', 400);
//     }

//     // Check if it's a valid UUID (not encrypted)
//     const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
//     if (uuidRegex.test(encodedData)) {
//       return encodedData; // It's already a UUID, return as is
//     }

//     // Try to decrypt (assuming it's encrypted)
//     const { decrypt } = await import('./encryption.js');
//     return decrypt(encodedData);
    
//   } catch (error) {
//     if (error instanceof AppError) {
//       throw error;
//     }
//     throw new AppError('Invalid or malformed profile identifier', 400);
//   }
// };