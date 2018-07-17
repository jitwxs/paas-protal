import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state={
  token:'',
  userInfo:{},
  projectId:'',
  editeContainerProjectId:''
}
const mutations={
  SET_TOKEN(state, token) {
    state.token = token
    sessionStorage.token = token
  },
  DEL_TOKEN(state){
    state.token = ''
    sessionStorage.removeItem('token');
  },
  CHANGE_USER_INFO(state,userInfo) {
    state.userInfo = userInfo
  },
  SET_PROJECT_ID(state,projectId) {
    state.projectId = projectId
  },
  SET_EDITE_CONTAINER_PROJECT_ID(state,editeContainerId){
    state.editeContainerProjectId = editeContainerId
  }
}
const actions={
  changeUserInfo({commit},userInfo){
    commit('CHANGE_USER_INFO',userInfo)
  },
  setProjectId({commit},projectId) {

    commit("SET_PROJECT_ID",projectId)
  },
  setEditeContainerProjectId({commit},id){
    commit("SET_EDITE_CONTAINER_PROJECT_ID",id)
}
}
const getters= {
    getUserInfo(state){
      return state.userInfo
    },
    getProjectId(state){
      return state.projectId;
    },
  getEidteContainerProjectId(state) {

      return state.editeContainerProjectId;
  }
}
export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})

