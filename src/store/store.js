import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
    token: '',
    userInfo: {},
    projectId: '',
    editeContainerProjectId: '',
    containerId :'',
    hostaddr:'192.168.100.110:9999',
    serviceId:'',
    currentMirrorId:'',
    unreadMessageNum:0,
    networkId:''
};

const mutations = {
    SET_CONTAINERID(state, containerId){
        state.containerId = containerId;
    },

    SET_TOKEN(state, token) {
        state.token = token;
        sessionStorage.token = token
    },
    DEL_TOKEN(state) {
        state.token = '';
        sessionStorage.removeItem('token');
    },
    CHANGE_USER_INFO(state, userInfo) {
        state.userInfo = userInfo
    },
    SET_PROJECT_ID(state, projectId) {
        state.projectId = projectId
    },
    SET_EDITE_CONTAINER_PROJECT_ID(state, editeContainerId) {
        state.editeContainerProjectId = editeContainerId
    },
    SET_SERVICE_ID(state,serviceId){
        state.serviceId = serviceId
    },
    SET_CURRENTMIRROR_ID(state,mirrorId){
        state.currentMirrorId = mirrorId;
    },
    SET_UNREAD_MESSAGE_NUM(state,num){
        state.unreadMessageNum = num;
    },
    SET_NETWORKID(state,networkId){
        state.networkId = networkId;
    }
}
const actions = {
    changeUserInfo({commit}, userInfo) {
        commit('CHANGE_USER_INFO', userInfo)
    },
    setProjectId({commit}, projectId) {

        commit("SET_PROJECT_ID", projectId)
    },
    setEditeContainerProjectId({commit}, id) {
        commit("SET_EDITE_CONTAINER_PROJECT_ID", id)
    },
    setContainerId({commit},containerId){
        commit("SET_CONTAINERID",containerId)
    },
    saveServiceId({commit},id){
        commit("SET_SERVICE_ID",id)
    },
    setUnreadMessageNum({commit},num){
        commit('SET_UNREAD_MESSAGE_NUM',num);
    }
}
const getters = {
    getUserInfo(state) {
        return state.userInfo
    },
    getProjectId(state) {
        return state.projectId;
    },
    getEidteContainerProjectId(state) {

        return state.editeContainerProjectId;
    },
    getContainerId(state){
        return state.containerId;
    },
    gethostaddr(state){
        return state.hostaddr;
    },
    getServiceId(state){
        return state.serviceId;
    },
    getCurrentMirrorId(state){
        return state.currentMirrorId;
    },
    getToken(state){
        return state.token;
    },
    getUnreadMessageNum(state){
        return state.unreadMessageNum;
    },
    getNetworkId(state){
        return state.networkId;
    }
};
export default new Vuex.Store({
    state,
    mutations,
    actions,
    getters
})

