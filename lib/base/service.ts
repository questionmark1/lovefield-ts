// FILE: lib/base/service.ts

class ServiceId<T> {
  // Boilerplate
  constructor(public value: string) {}

  toString(): string {
    return this.value;
  }
}

namespace service {
  public static BACK_STORE: ServiceId<BackStore> =
      new ServiceId<BackStore>('backstore');
  public static CACHE: ServiceId<Cache> =
      new ServiceId<Cache>('cache');
  public static INDEX_STORE: ServiceId<IndexStore> =
      new ServiceId<IndexStore>('indexstore');
  public static QUERY_ENGINE: ServiceId<QueryEngine> =
      new ServiceId<QueryEngine>('engine');
  public static RUNNER: ServiceId<Runner> =
      new ServiceId<Runner>('runner');
  public static OBSERVER_REGISTRY: ServiceId<ObserverRegistry> =
      new ServiceId<ObserverRegistry>('observerregistry');
  public static SCHEMA: ServiceId<Database> =
      new ServiceId<Database>('schema');
}
