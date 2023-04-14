import { request } from '@/utils/request';
import { BaseListModel, RequestListParams } from '@/api/model/baseModel';
import { ShareDataModel } from '@/api/model/shareDataModel';
import { DataStandardModel } from '@/api/model/dataStandardModel';

const Api = {
  shareData: '/share_data',
  dataStandard: '/data_standard',
};

export const getDataSharingList = (params: RequestListParams) => {
  return request.get<BaseListModel<ShareDataModel>>({
    url: Api.shareData,
    params,
  });
};

export const getDataStandard = (params: RequestListParams) => {
  return request.get<BaseListModel<DataStandardModel>>({
    url: Api.dataStandard,
    params,
  });
};

export const addShareData: any = (data: ShareDataModel) => {
  return request.post({
    url: Api.shareData,
    data,
  });
};

export const editShareData = (id: string, data: ShareDataModel) => {
  return request.patch({
    url: `${Api.shareData}/${id}`,
    data,
  });
};

export const delShareData = (id: string) => {
  return request.delete({
    url: `${Api.shareData}/${id}`,
  });
};

export const onShareData = (id: string) => {
  return request.post({
    url: `${Api.shareData}/on/${id}`,
  });
};

export const offShareData = (id: string) => {
  return request.post({
    url: `${Api.shareData}/off/${id}`,
  });
};
