import app from './app';
import seedAdmin from './app/DB';
import config from './app/config/config';
import mongoose from 'mongoose';

async function main() {
  try {
    await mongoose.connect(config.database_url as string);

    seedAdmin();

    app.listen(config.port, () => {
      console.log(`Robotic Club app listening on port ${config.port}`);
    });
  } catch (error) {
    console.log(error);
  }
}

main().catch((err) => console.log(err));
