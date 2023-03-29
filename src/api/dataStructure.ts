import { dataStructureModel } from './model/dataStructureModel';
import { RequestListParams, BaseListModel } from './model/baseModel';
import { request } from '@/utils/request';

const Api = '/data_structure';

export const getDataStructureList = (params: RequestListParams) => {
  return request.get<BaseListModel<dataStructureModel>>({
    url: Api,
    params,
  });
};

export const editDataStructure = (id: string, data: dataStructureModel) => {
  return request.patch<dataStructureModel>({
    url: `${Api}/${id}`,
    data,
  });
};

export const addDataStructure = (data: dataStructureModel) => {
  return request.post<dataStructureModel>({
    url: Api,
    data,
  });
};

export const deleteDataStructure = (id: string) => {
  return request.delete({
    url: `${Api}/${id}`,
  });
};
