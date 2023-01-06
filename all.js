const root = ReactDOM.createRoot(document.querySelector('#root'));
const { useState } = React;

// !App
function App() {
  return (
    <TodoPage />
  )
}

// !頁面
function TodoPage() {
  return (
    <>
      <div id="todoListPage" className="bg-half">
        <Header />
        <TodoContainer />
      </div>
    </>
  )
}

// ! 第一層
function Header() {
  return (
    <>
      <nav>
        <h1><a href="#">ONLINE TODO LIST</a></h1>
      </nav>
    </>
  )
}

function TodoContainer() {
  const [data, setData] = useState([
    {
      completed_at: null,
      content: '把那個蘋果放在頭上',
      id: 1
    },
    {
      completed_at: '2023-01-02T19:59:01.208+08:00',
      content: '哩叫我衝啥',
      id: 2
    },
    {
      completed_at: null,
      content: '塔斯丁狗',
      id: 3
    }
  ]);

  return (
    <div className="conatiner todoListPage vhContainer">
      <div className="todoList_Content">
        <InputTodo data={data} setData={setData} />
        <TodoList data={data} setData={setData} />
      </div>
    </div>
  )
} //? [data,setData] *1

// ! 第二層
function InputTodo({ data, setData }) {
  const [value, setValue] = useState('')
  const addTodo = () => {
    if (value !== '') {
      setData([
        ...data,
        {
          completed_at: null,
          content: value,
          id: data.length
        },
      ])
      setValue('');
    }
  }
  return (
    <div className="inputBox">
      <input type="text" placeholder="請輸入待辦事項" value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' ? addTodo() : null}
      />
      <a href="#"
        onClick={() => addTodo()}>
        <i className="fa fa-plus"></i>
      </a>
    </div>
  )
} //? *1

function TodoList({ data, setData }) {
  const [tabState, setTabState] = useState('全部') //重新渲染
  const [tabData, setTabData] = useState([
    {
      name: '全部',
      className: 'active'
    },
    {
      name: '待完成',
      className: null
    },
    {
      name: '已完成',
      className: null
    }
  ])
  let filterData = [];
  const length = data.filter((item) => item.completed_at).length
  const delCompleted = () => {
    filterData = data.filter((item) => item.completed_at === null);
    setData(filterData);
  }
  const tabFilter = () => {
    switch (tabState) {
      case '全部':
        filterData = data
        break;

      case '待完成':
        filterData = data.filter((item) => item.completed_at === null);
        break;

      case '已完成':
        filterData = data.filter((item) => item.completed_at);
        break;

      default:
        break;
    }
  }
  tabFilter()
  return (
    <div className="todoList_list">
      <ul className="todoList_tab">
        {tabData.map((item, index) => {
          return (
            // 可拆成 < TabList/>
            <li key={index}
              onClick={() => {
                //return判斷
                if (item.className === 'active') {
                  return;
                }
                //複製
                const newTab = [...tabData];
                newTab.map((item, i) => {
                  //修改 className = active
                  item.className = i === index ? 'active' : null
                })
                setTabData(newTab); // active tab className
                setTabState(item.name) // 更改 tabState
              }
              }><a href="#" className={item.className}>{item.name}</a></li>
          )
        })}
      </ul>
      <div className="todoList_items">
        <ul className="todoList_item">
          {(() => {
            if (filterData.length === 0) {
              if (tabState === '已完成') {
                return (
                  <li>
                    <label className="todoList_label content-center">
                      <p className="text-gray">目前尚無完成清單</p>
                    </label>
                  </li>
                )
              } else {
                return (
                  <li>
                    <label className="todoList_label content-center">
                      <p className="text-gray">目前尚無待辦清單</p>
                    </label>
                  </li>
                )
              }
            }
          })()}
          {filterData.map((item, i) => {
            return (
              <ListItem key={i} data={data} setData={setData} item={item} />
            )
          })}
        </ul>
        <div className="todoList_statistics">
          <p> {length} 個已完成項目</p>
          <a href="#" onClick={delCompleted}>清除已完成項目</a>
        </div>
      </div>
    </div >
  )
} //? *2

// ! 第三層 這一層props最多東西 => 所以上一層我傳item，裡面在解構item內的屬性
function ListItem({ data, setData, item }) {
  const { id, completed_at, content } = item
  const delTodo = () => {
    const filterData = data.filter((item) => {
      return ((item.id) !== id)
    })
    setData(filterData)
  }
  const todoChecked = (e) => {
    if (e.target.nodeName !== 'INPUT') {
      return;
    }
    let newAry = [...data];
    newAry.map((item) => {
      if (item.id === id) {
        item.completed_at = item.completed_at ? null : String(Date())
      }
      return item;
    });
    setData(newAry);
  }
  const checked = completed_at ? true : false;
  return (
    <li>
      <label className="todoList_label">
        <input className="todoList_input" type="checkbox" value="true"
          // ! 這裏有雷
          checked={checked}
          onChange={(e) => {
            todoChecked(e);
            console.log(data); // 方便顯示資料內日期
          }} />
        <span>{content}</span>
      </label>
      <a href="#"
        onClick={delTodo}>
        <i className="fa fa-times"></i>
      </a>
    </li>
  )
}

root.render(
  <App />
)

// 原始寫法props太多 
// function ListItem({ data, setData, id, completed_at, content })

// 如果全不拆都寫在App
// function App_Fake() {
//   const [data, setData] = useState()
//   const [value, setValue] = useState()
//   const [tab, setTab] = useState() // 類似style Component
//   const [tabState, setTabState] = useState()
//   return (
//     <></>
//   )
// }
