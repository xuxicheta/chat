import * as path from 'path';

export const envFilePath = path.join(__dirname, 'src', 'environments', `${process.env.NODE_ENV || 'development'}.env`);
