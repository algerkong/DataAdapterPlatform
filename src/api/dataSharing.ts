import { request } from '@/utils/request';

const Api = {
  dataSharing: '/share_data',
  dataStandard: '/data_standard',
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

export const postaddDate: any = (data: string) => {
  return request.post({
    url: Api.dataSharing,
    data,
  });
};

export const reviseStatuson = (id: string) => {
  return request.post({
    url: `${'/share_data/on'}/${id}`,
  });
};

export const reviseStatusoff = (id: string) => {
  return request.post({
    url: `${'/share_data/off'}/${id}`,
  });
};

export const deleteDatas = (id: string) => {
  return request.delete({
    url: `${Api.dataSharing}/${id}`,
  });
};

export const reviseDates = (id: string, data) => {
  return request.patch({
    url: `${Api.dataSharing}/${id}`,
    data,
  });
};
