import { request } from '@/utils/request';
import { BaseListModel } from './model/baseModel';
import { logModule } from './model/logModel';

const Api = {
  log: '/log',
};

export const getLogLists = (parms: any) => {
  return request.get<BaseListModel<logModule>>({
    url: Api.log,
    params: parms,
  });
};
