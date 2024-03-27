import api from './api'


const createHistoric = async data => {
    return api.post("/api/dashboard/create_historic", data);
};

const getTotalHitsLast30Days = () => {
    return api.get("/api/dashboard/total_hits_last_30days");
};

const getFrequencyByMonthYear = (year, month) => {
    return api.get(`/api/dashboard/frequency_by_month_year/${year}/${month}`);
};

const getHistoric90daysByUser = () => {
    return api.get("/api/dashboard/historic_90days_by_user");
};

const getTop10WrongWordsByUser = () => {
    return api.get("/api/dashboard/top10_wrong_words_by_user");
};


export const dashboardService = {
    createHistoric,
    getTotalHitsLast30Days,
    getFrequencyByMonthYear,
    getHistoric90daysByUser,
    getTop10WrongWordsByUser
};