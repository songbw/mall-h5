import Mock from 'mockjs'
import decision from './decision'

Mock.mock(/\/decision\/getAppConfig/,'get',decision.getAppConfig);