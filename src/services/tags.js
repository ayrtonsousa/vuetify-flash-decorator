import api from './api'


  const getAll = () => {
      return api.get("/api/tags/");
  };
  
  const get = name => {
    return api.get(`/api/tags/${name}`);
  };

  const create = async data => {
    return api.post("/api/tags/", data);
  };
  
  const remove = async name => {
    return api.delete(`/api/tags/${name}`);
  };
  
  
export const tagsService = {
    getAll,
    get,
    create,
    remove
};