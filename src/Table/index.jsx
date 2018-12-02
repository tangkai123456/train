import React from 'react';
import { Table, Button, Modal, message, Input, Pagination } from 'antd';
import queryString from 'query-string';
import { debounce } from 'lodash';
import AddForm from './AddForm';
import styles from './index.scss';

class TableComponent extends React.PureComponent {
  state = {
    data: [],
    page: 1,
    pageSize: 20,
    total: 0,
    loading: false,
    visible: false,
    selectedRowKeys: [],
    selectedRow: undefined,
    search: undefined,
  }
  columns = [
    {
      title: '车号',
      dataIndex: 'code',
      filter: true,
    },
    {
      title: '车型',
      dataIndex: 'type',
    },
    {
      title: '厂修',
      dataIndex: 'cx',
    },
    {
      title: '段修',
      dataIndex: 'dx',
    },
    {
      title: '辅修',
      dataIndex: 'fx',
    },
    {
      title: '故障信息',
      dataIndex: 'hitch',
    },
    {
      title: '操作',
      render: (text, record) => {
        return (
          <div>
            <Button onClick={this.handleEdit(record)} className="action-btn">编辑</Button>
            <Button onClick={this.handleDel(record)} className="action-btn">删除</Button>
          </div>
        );
      }
    },
  ];

  componentDidMount() {
    this.fetchData();
  }

  handleEdit = (record) => {
    return () => {
      this.setState({
        visible: true,
        selectedRow: record,
      })
    }
  }

  handleDel = (record) => {
    return () => {
      this.delete([record.code]);
    }
  }

  delete = (codeList) => {
    return window.fetch('http://localhost:7001/api/train', {
      method: 'delete',
      body: JSON.stringify({ codeList }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      type: 'json',
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        message.success("删除成功");
        this.fetchData();
      })
  }

  fetchData = (params) => {
    this.setState({
      loading: true,
    })
    const { page, pageSize, search } = this.state;
    return window.fetch(`http://localhost:7001/api/train/list?${queryString.stringify({ page, pageSize, search })}`, {
      method: 'get',
      type: 'json',
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        const { list, total } = res;
        this.setState({
          loading: false,
          data: list,
          total,
        })
        return res;
      })
  }

  handleTableChange = async (pageInfo, filter, sorter) => {
    this.setState({
      page: pageInfo.page,
      pageSize: pageInfo.pageSize,
      selectedRow: [],
      filter,
      sorter,
    }, () => {
      this.fetchData();
    })
  }

  openAddForm = () => {
    this.setState({
      visible: true,
    });
  }

  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  }

  handleCloseForm = () => {
    this.setState({
      visible: false,
      selectedRow: undefined,
    })
  }

  handleSubmit = () => {
    this.handleCloseForm();
    this.fetchData();
  }

  deleteGroup = () => {
    this.delete(this.state.selectedRowKeys)
      .then(() => {
        this.setState({
          selectedRowKeys: [],
        })
      })
  }

  handleChange = (e) => {
    this.setState({
      search: e.target.value,
      page: 1,
      selectedRowKeys: [],
    }, () => {
      this.debounceFetch();
    });
  }

  debounceFetch = debounce(this.fetchData, 300);

  changePage = (page, pageSize) => {
    this.setState({
      page,
      pageSize,
      selectedRowKeys: [],
    }, () => {
      this.fetchData();
    });
  }

  render() {
    const { data, page, pageSize, total, loading, visible, selectedRowKeys, selectedRow } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    return (
      <div className={styles.root}>
        <Input onChange={this.handleChange} className="search-input" placeholder="请输入搜索值" />
        <Button onClick={this.openAddForm} className="action-btn">添加</Button>
        <Button onClick={this.deleteGroup} className="action-btn" disabled={!selectedRowKeys.length}>批量删除</Button>
        <Table
          columns={this.columns}
          rowKey={record => record.code}
          dataSource={data}
          pagination={false}
          loading={loading}
          rowSelection={rowSelection}
        />
        <Pagination
          className="table-pagination"
          current={page}
          pageSize={pageSize}
          total={total}
          showQuickJumper
          showSizeChanger
          onChange={this.changePage}
          onShowSizeChange={this.changePage}
        />
        <Modal visible={visible} title="添加\修改" footer={false} onCancel={this.handleCloseForm} >
          <AddForm onSubmit={this.handleSubmit} selectedRow={selectedRow} />
        </Modal>
      </div>
    );
  }
}

export default TableComponent;
