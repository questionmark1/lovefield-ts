// FILE: lib/base/global.ts

import {Exception} from 'exception';

export class Global {
  private services_: Map<string, Object>;

  constructor() {
    this.services_ = new Map();
  }

  private static instance_: Global;
  public static get(): Global {
    if (!Global.instance_) {
      Global.instance_ = new Global();
    }
    return Global.instance_;
  }

  public clear(): void {
    this.services_.clear();
  }

  public registerService<T>(serviceId: string, service: T): T {
    this.services_.set(serviceId, service);
    return service;
  }

  public getService<T>(serviceId: string): T {
    var service = <T>this.services_.get(serviceId.toString()) || null;
    if (service == null) {
      // 7: Service {0} not registered.
      throw new Exception(7, serviceId.toString());
    }
    return service;
  }

  public isRegistered(serviceId: string): boolean {
    return this.services_.has(serviceId.toString());
  }
}
