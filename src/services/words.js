import api from './api'


  const getAll = () => {
      return api.get("/api/words/");
  };
  
  const get = id => {
    return api.get(`/api/words/${id}`);
  };

  const create = async data => {
    return api.post("/api/words/", data);
  };
  
  const update = async (id, data) => {
    return api.put(`/api/words/${id}`, data);
  };
  
  const remove = async id => {
    return api.delete(`/api/words/${id}`);
  };
  
  
export const wordsService = {
    getAll,
    get,
    create,
    update,
    remove
};