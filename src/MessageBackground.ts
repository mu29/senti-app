import configureClient from './apollo';
import { NotificationService } from 'services';

export default async () => {
  try {
    const client = await configureClient();
    NotificationService.setClient(client);
    NotificationService.sync();
  } catch (e) {
    console.error(e);
  }

  return Promise.resolve();
};
