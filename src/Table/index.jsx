import React from 'react';
import { Button, Modal, message, Input, Pagination } from 'antd';
import queryString from 'query-string';
import { debounce } from 'lodash';
import { AgGridReact } from 'ag-grid-react';
import AddForm from './AddForm';
import styles from './index.scss';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import 'ag-grid-community/dist/styles/ag-theme-balham-dark.css';
import "ag-grid-enterprise";

const normalLocaleText = {
  copy: '复制',
  copyWithHeaders: '复制与标题',
  ctrlC: 'ctrl  C',
  paste: '粘贴',
  ctrlV: 'ctrl  V',
  toolPanel: '工具面板',
  export: '导出',
  csvExport: 'CSV导出',
  excelExport: 'Excel导出',
  rowGroupColumnsEmptyMessage: "如需汇总, 请拖置此处",
  pinColumn: '固定列',
  pinLeft: '左固定',
  pinRight: '右固定',
  noPin: '无固定',
  autosizeThiscolumn: '自动调整此列',
  autosizeAllColumns: '自动调整所有列',
  resetColumns: '重置列',
  groupBy: '按此列汇总',
  noRowsToShow: "暂无数据"
};

class TableComponent extends React.PureComponent {
  state = {
    data: [],
    page: 1,
    pageSize: 20,
    total: 0,
    loading: false,
    visible: false,
    selectedRow: undefined,
    search: undefined,
  }
  columns = [
    {
      headerName: '车号',
      field: 'code',
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      checkboxSelection: true,
      width: 100,
    },
    {
      headerName: '车型',
      field: 'type',
      width: 100,
    },
    {
      headerName: '厂修',
      field: 'cx',
      width: 180,
    },
    {
      headerName: '段修',
      field: 'dx',
      width: 180,
    },
    {
      headerName: '辅修',
      field: 'fx',
      width: 180,
    },
    {
      headerName: '故障信息',
      field: 'hitch',
      width: 430,
    },
    {
      headerName: '操作',
      width: 150,
      cellRendererFramework: ({ data }) => {
        return (
          <div>
            <Button onClick={this.handleEdit(data)} className="action-btn">编辑</Button>
            <Button onClick={this.handleDel(data)} className="action-btn">删除</Button>
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
      this.delete([record.id]);
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
    const selected = this.agGrid.api.getSelectedRows();
    if (selected.length) {
      this.delete(selected.map(item => item.id));
    } else {
      message.warning("请选择");
    }
  }

  handleChange = (e) => {
    this.setState({
      search: e.target.value,
      page: 1,
    }, () => {
      this.debounceFetch();
    });
  }

  debounceFetch = debounce(this.fetchData, 300);

  changePage = (page, pageSize) => {
    this.setState({
      page,
      pageSize,
    }, () => {
      this.fetchData();
    });
  }

  render() {
    const { data, page, pageSize, total, loading, visible, selectedRow } = this.state;
    return (
      <div className={styles.root}>
        <Input onChange={this.handleChange} className="search-input" placeholder="请输入搜索值" />
        <Button onClick={this.openAddForm} className="action-btn">添加</Button>
        <Button onClick={this.deleteGroup} className="action-btn">批量删除</Button>
        <AgGridReact
          columnDefs={this.columns}
          rowData={data}
          pagination={false}
          loading={loading}
          localeText={normalLocaleText}
          domLayout="autoHeight"
          enableColResize
          rowHeight={40}
          onGridReady={(params) => {
            this.agGrid = params;
          }}
          suppressRowClickSelection
          rowSelection="multiple"
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
        <Modal visible={visible} title="添加\修改" footer={false} onCancel={this.handleCloseForm} destroyOnClose>
          <AddForm onSubmit={this.handleSubmit} selectedRow={selectedRow} />
        </Modal>
      </div>
    );
  }
}

export default TableComponent;
