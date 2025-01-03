import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from 'uuid'

const initialState = {
  item: {
    id: uuidv4(),
    name: '',
    price: 0,
    sort: '',
    tag: '',
    url: '',
  },
  list: {
    id: ''
  },
  selectedTable: {
    id: "",
    init: {},
    tableName: "",
    orderList: []
  },
  selectedListId: '',
  clientTableList: []
}

const itemSlice = createSlice({
  name: 'itmeState',
  initialState,
  reducers: {
    resetItemState: () => {
      return initialState;
    },
    getItemInfo: (state, action) => {
      const item = action.payload.item;
      return {
        ...state,
        item
      }
    },
    getOrderListInfo: (state, action) => {
      const list = action.payload.list;
      return {
        ...state,
        list
      }
    },
    getSelectedListId: (state, action) => {
      const selectedListId = action.payload.selectedListId
      return {
        ...state,
        selectedListId
      }
    },
    getClientTableList: (state, action) => {
      const clientTableList = action.payload.clientTableList;
      return {
        ...state,
        clientTableList
      }
    },
    selectTable: (state, action) => {
      const selectedTable = action.payload.table
      return {
        ...state,
        selectedTable
      }
    }
  }
})

export const { resetItemState, getItemInfo, getOrderListInfo, getSelectedListId, getClientTableList, selectTable } = itemSlice.actions;
export default itemSlice.reducer;