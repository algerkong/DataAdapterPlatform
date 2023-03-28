import { request } from '@/utils/request';

const Api = {
  dataSharing: '/share_data',
  dataStandard: '/data_standard',
  addDates: '/share_data',
};

export const getDataSharingList = (parms: any) => {
  return request.get({
    url: Api.dataSharing,
    params: parms,
  });
};

export const getDataSpecification = (params: any) => {
  return request.get({
    url: Api.dataStandard,
    params,
  });
};

export const postaddDate = (data: string) => {
  return request.delete({
    url: Api.addDates,
    data,
  });
};

export const editSystem = (id: string, data: any) => {
  return request.patch({
    url: `${Api.dataSharing}/${id}`,
    data,
  });
};
