import server from './app';
import connectDB from './db/connect';

const port = process.env.PORT || 5000;

const main = async () => {
  try {
    const isConnected = await connectDB();

    const app_server = server.listen(port, () => {
      console.log(`App listening on port ${port}`);
    });

    if (isConnected != undefined) {
      console.log('Database connected');
      app_server;
    } else {
      app_server.close(() => {
        process.exit(1);
      });
    }
  } catch (error) {
    console.log(error);
  }
};

main();
