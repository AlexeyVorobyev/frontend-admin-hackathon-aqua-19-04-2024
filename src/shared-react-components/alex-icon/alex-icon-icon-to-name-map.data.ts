import {OverridableComponent} from '@mui/material/OverridableComponent'
import {SvgIconTypeMap} from '@mui/material'
import ScheduleIcon from '@mui/icons-material/Schedule'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import TagIcon from '@mui/icons-material/Tag'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
import BarChartIcon from '@mui/icons-material/BarChart'
import LinkIcon from '@mui/icons-material/Link'
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import SearchIcon from '@mui/icons-material/Search'
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess'
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore'
import CloseIcon from '@mui/icons-material/Close'

export enum EIconToNameMap {
    close = 'close',
    schedule = 'schedule',
    calendar = 'calendar',
    tag = 'tag',
    collapse = 'collapse',
    expand = 'expand',
    keyBoardArrowLeft = 'keyBoardArrowLeft',
    keyBoardArrowRight = 'keyBoardArrowRight',
    manageAccounts = 'manageAccounts',
    barChart = 'barChart',
    link = 'link',
    assignment = 'assignment',
    location = 'location',
    moreHoriz = 'moreHoriz',
    search = 'search'
}

type TIconToNameMap = {
    [key in EIconToNameMap]: OverridableComponent<SvgIconTypeMap<{}, 'svg'>> & { muiName: string };
}

export const IconToNameMap: TIconToNameMap = {
    close: CloseIcon,
    expand: UnfoldMoreIcon,
    collapse: UnfoldLessIcon,
    moreHoriz: MoreHorizIcon,
    location: LocationOnIcon,
    schedule: ScheduleIcon,
    calendar: CalendarMonthIcon,
    tag: TagIcon,
    keyBoardArrowLeft: KeyboardArrowLeftIcon,
    keyBoardArrowRight: KeyboardArrowRightIcon,
    manageAccounts: ManageAccountsIcon,
    barChart: BarChartIcon,
    link: LinkIcon,
    assignment: AssignmentIndIcon,
    search: SearchIcon,
}