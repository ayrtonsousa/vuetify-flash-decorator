import api from './api'


const getAll = () => {
  return api.get("/api/users/");
};

const get = (id) => {
  return api.get(`/api/users/${id}`);
};

const create = async data => {
  return api.post("/api/users/", data);
};

const update = async (data) => {
  return api.put(`/api/users/me/`, data);
};

const remove = async (id) => {
  return api.delete(`/api/users/${id}`);
};

const getAllRoles = () => {
  return api.get("/api/users/roles");
};

const updateRoles = async (id, data) => {
  return api.put(`/api/users/update_roles/${id}`, data);
};

const changePassword = async (data) => {
  return api.post(`/api/users/me/update_password`, data);
};
  
  
export const userService = {
    getAll,
    get,
    create,
    update,
    remove,
    getAllRoles,
    updateRoles,
    changePassword,
};