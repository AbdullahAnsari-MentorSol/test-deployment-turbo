import { z } from 'zod';

export const zodParseFactory =
  <T extends z.ZodTypeAny>(schema: T) =>
  (data: unknown): z.infer<T> => {
    try {
      return schema.parse(data) as unknown;
    } catch (err) {
      console.error(err);

      // handle error
      throw new Error(`Invalid data: ${err as string}`);
    }
  };

export async function captureException(exception: unknown) {
  const { getServerMonitoringService } = await import('@kit/monitoring/server');

  const service = await getServerMonitoringService();

  await service.ready();

  const error =
    exception instanceof Error ? exception : new Error(exception as string);

  return service.captureException(error);
}
