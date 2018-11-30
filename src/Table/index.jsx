import React from 'react';
import { Table, Button, Modal } from 'antd';
import AddForm from './AddForm';

const columns = [{
  title: '姓名',
  dataIndex: 'name',
  sorter: true,
}, {
  title: '年龄',
  dataIndex: 'age',
  width: '20%',
}, {
  title: '电话',
  dataIndex: 'phone',
}];

class TableComponent extends React.PureComponent {
  state = {
    data: [],
    page: 1,
    pageSize: 20,
    totalRecord: 0,
    loading: false,
    visible: false,
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = (params) => {
    this.setState({
      loading: true,
    })
    return window.fetch('http://localhost:7001/api/list', {
      method: 'get',
      data: {
        results: 10,
        ...params,
      },
      type: 'json',
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        const { list, totalRecord } = res;
        this.setState({
          loading: false,
          data: list,
          totalRecord,
        })
        return res;
      })
  }

  handleTableChange = async (pageInfo, filters, sorter) => {
    await this.fetchData({
      page: pageInfo.page,
      pageSize: pageInfo.pageSize,
    })
    this.setState({
      page: pageInfo.page,
      pageSize: pageInfo.pageSize,
    })

  }
  render() {
    const { data, page, pageSize, totalRecord, loading, visible } = this.state;
    return (
      <div>
        <Button>添加</Button>
        <Table
          columns={columns}
          rowKey={record => record.id}
          dataSource={data}
          pagination={{ page, pageSize, totalRecord }}
          loading={loading}
          onChange={this.handleTableChange}
        />
        <Modal visible={visible}>
          <AddForm />
        </Modal>
      </div>
    );
  }
}

export default TableComponent;
