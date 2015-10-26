// FILE: lib/base/global.ts

import {Exception} from 'exception';
import {ServiceId} from 'service';

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

  public registerService<T>(serviceId: ServiceId<T>, service: T): T {
    this.services_.set(serviceId.toString(), service);
    return service;
  }

  public getService<T>(serviceId: ServiceId<T>): T {
    var service = <T>this.services_.get(serviceId.toString()) || null;
    if (service == null) {
      // 7: Service {0} not registered.
      throw new Exception(7, serviceId.toString());
    }
    return service;
  }

  public isRegistered<T>(serviceId: ServiceId<T>): boolean {
    return this.services_.has(serviceId.toString());
  }
}
