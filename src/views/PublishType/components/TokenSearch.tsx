import React, { useState, useMemo } from 'react'
import styled from 'styled-components'
import { useMount } from 'ahooks'
import BigNumber from 'bignumber.js'
import { useSelector, useDispatch } from "react-redux";
import { getTokenList, tokenTokenList } from '../../../api/api'
import { Select, Spin, Avatar } from 'antd';
import debounce from 'lodash/debounce'

import { getCookie } from '../../../utils/cookie'
import { selectUser, setUser } from '../../../store/userSlice'

const { Option } = Select;

interface TokenSearchProps {
  token: string|number
}

const Home: React.FC<any> = ({value = {}, onChange, token }) => {
  // Fan票搜索框相关变量
  const [searchData, setSearchData] = useState<any[]>([])
  const memoToken = useMemo(() => !!token, [ token ])
  const user: any = useSelector(selectUser)

  // 获取数据
  useMount(() => {
    const getData = async() => {
      try {
        if (!user.id) return

        const result: any = await tokenTokenList({
          pagesize: 999,
          order: 0
        })
        if (result && result.code === 0) {
          // console.log('result', result)
          setSearchData(result.data.list)
        }
      } catch (error) {
        console.log('error', error)
      }
    }

    getData()
  })

  /** Fan票选择事件 */
  const handleUserSearchChange = (value: any) => {
    console.log('value', value)
    onChange(value)
  }

  const amount = (price: number, decimals: number) => {
    let BN = BigNumber.clone()
    BN.config({ DECIMAL_PLACES: 3 })
    let single = new BN(Number(price)).dividedBy(10 ** Number(decimals))
    return single.toString()
  }

  /** Fan票搜索框用到的展示卡片 */
  function Card (props: any) {
    const { card } = props

    return (
      <StyledCard>
        <div className="token-main">
          <Avatar className="token-logo" size={28} src={process.env.REACT_APP_MTTK_IMG_CDN + card.logo} />
          <span style={{ fontSize: 14, color: '#333' }}>
            { card.name }
            <span style={{ color: '#7c7c7c', margin: '0 4px' }}>({ card.symbol })</span>
            <span>{ amount(card.amount, card.decimals) }</span>
          </span>
        </div>
      </StyledCard>
    )
  }

  return (
    <Select
      size="large"
      showSearch
      optionFilterProp="children"
      placeholder="请选择Fan票"
      onChange={handleUserSearchChange}
      filterOption={(input, option) => (option.val.name + ' ' + option.val.symbol).toLowerCase().indexOf(input.toLowerCase()) >= 0}
      style={{ width: '100%' }}
      value={token}
      disabled={ memoToken }
    >
      {searchData.map(i => (
        <Option key={i.token_id} value={i.token_id} val={ i }>
          <Card card={i} />
        </Option>
      ))}
    </Select>
  )
}

const StyledCard = styled.div`
  display: flex;
  height: 38px;

  .token-logo {
    margin-right: 5px;
  }

  .token-main {

  }
`

export default Home
