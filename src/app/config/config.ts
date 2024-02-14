import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.join((process.cwd(), '.env')),
});

export default {
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATBASE_URL,
  bcrypt_salt_round: process.env.BCRYPT_SALT_ROUND,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_access_expiress_in: process.env.JWT_ACCESS_EXPIRES_IN,

  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_refresh_expiress_in: process.env.JWT_REFRESH_EXPIRES_IN,

  reset_password_ui_link: process.env.RESET_PASSWORD_UI_LINK,

  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
};
