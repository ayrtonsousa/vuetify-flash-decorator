import api from './api'


  const getAll = () => {
      return api.get("/api/set_words/");
  };
  
  const get = name => {
    return api.get(`/api/set_words/${name}`);
  };

  const getWordsBySet = id => {
    return api.get(`/api/set_words/words/${id}`);
  };

  const create = async data => {
    return api.post("/api/set_words/", data);
  };
  
  const update = async (name, data) => {
    return api.put(`/api/set_words/${name}`, data);
  };
  
  const remove = async name => {
    return api.delete(`/api/set_words/${name}`);
  };
  
  
export const setWordsService = {
    getAll,
    get,
    create,
    update,
    remove,
    getWordsBySet
};