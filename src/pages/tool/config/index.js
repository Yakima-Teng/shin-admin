/*
 * @Author: strick
 * @Date: 2021-01-26 17:22:19
 * @LastEditTime: 2021-02-02 15:02:50
 * @LastEditors: strick
 * @Description: 全局通用配置
 * @FilePath: /strick/shin-admin/src/pages/tool/config/index.js
 */
import { Input, Divider, Popconfirm } from 'antd';
import { connect } from 'dva';
import Btns from "components/Common/Template/List/Btns";
// import Query from "components/Common/Template/List/Query";
import List from "components/Common/Template/List/List";
import CreateModal from "components/Common/Template/CreateModal";
import { setColumn, breakWord } from "utils/tools";
import { TEMPLATE_MODEL } from "utils/constants";
import api from "api";
/* eslint-disable */
const { TextArea } = Input;
const Config = ({ dispatch }) => {
  //CreateModal组件属性
  const modalProps = {
    url: api.toolConfigCreate,
    initUrl: api.toolConfigQuery,
    attrs: {
      name: "add",
      width: 800,
      title: "通用配置"
    },
    btns: {
      formatValues: values => {
        values.content = JSON.stringify(eval(`(${values.content})`));
        return values;
      },
    },
    initControls: (record) => [
      {
        label: "标题",
        name: "title",
        params: {
          rules: [
            { required: true, message: "标题不能为空" },
          ],
          initialValue: record.title
        },
        control: <Input />
      },
      {
        label: "内容",
        name: "content",
        params: {
          rules: [
            { required: true, message: "内容不能为空" },
          ],
          initialValue: record.content ? JSON.stringify(JSON.parse(record.content), null, 2) : ""
        },
        control: <TextArea style={{height:400}} placeholder="JSON格式的数据"/>,
      },
    ]
  };

  //顶部按钮
  const btnsProps = {
    btns: [
      {
        type: "create",
        data: {
          params: { modalName: modalProps.attrs.name }
        }
      }
    ]
  };

  /**
   * 编辑短链
   */
  function edit(record) {
    dispatch({
      type: TEMPLATE_MODEL.MODAL,
      payload: {
        params: record,
        modalName: modalProps.attrs.name
      }
    });
  }
  /**
   * 删除短链
   */
  function del(id) {
    dispatch({
      type: TEMPLATE_MODEL.HANDLE,
      payload: {
        params: { id },
        url: api.toolConfigDel,
        initUrl: listProps.url,
      }
    });
  }

  //List组件属性
  const listProps = {
    url: api.toolConfigQuery,
    columns: [
      setColumn("key", "key", { width: "30%", render: breakWord }),
      setColumn("标题", "title", { width: "20%", render: breakWord }),
      setColumn("内容", "content", { width: "30%", render: breakWord }),
      setColumn("操作", "id", {
        key: "operate",
        render: (id, record) => {
          return (
            <div>
              {
                <span>
                  <a onClick={() => edit(record)}>编辑</a>
                  <Divider type="vertical" />
                </span>
              }
              {
                <span>
                  <Popconfirm title="确定要删除吗" onConfirm={() => del(id)}>
                    <a>删除</a>
                  </Popconfirm>
                </span>
              }
            </div>
          );
        }
      })
    ],
  };
  
  return (
    <>
      <Btns {...btnsProps}></Btns>
      <CreateModal {...modalProps}></CreateModal>
      <List {...listProps}></List>
    </>
  );
};

export default connect(data => data.toolConfig)(Config);