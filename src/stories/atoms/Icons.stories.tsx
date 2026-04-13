import type { Meta, StoryObj } from '@storybook/nextjs'
import ArrowPathIcon from '@/components/atoms/icons/ArrowPathIcon'
import BellIcon from '@/components/atoms/icons/BellIcon'
import BookmarkIcon from '@/components/atoms/icons/BookmarkIcon'
import ButtonMenuIcon from '@/components/atoms/icons/ButtonMenuIcon'
import CheckIcon from '@/components/atoms/icons/CheckIcon'
import ChevronsLeftIcon from '@/components/atoms/icons/ChevronsLeftIcon'
import ChevronsRightIcon from '@/components/atoms/icons/ChevronsRightIcon'
import CloseIcon from '@/components/atoms/icons/CloseIcon'
import CloseIconGradient from '@/components/atoms/icons/CloseIconGradient'
import CopyIcon from '@/components/atoms/icons/CopyIcon'
import DeleteIcon from '@/components/atoms/icons/DeleteIcon'
import DownArrowFillIcon from '@/components/atoms/icons/DownArrowFillIcon'
import DownArrowIcon from '@/components/atoms/icons/DownArrowIcon'
import DownloadIcon from '@/components/atoms/icons/DownloadIcon'
import EllipsisHorizontalIcon from '@/components/atoms/icons/EllipsisHorizontalIcon'
import ErrorIcon from '@/components/atoms/icons/ErrorIcon'
import HeaderUserIcon from '@/components/atoms/icons/HeaderUserIcon'
import InfoIcon from '@/components/atoms/icons/InfoIcon'
import LeftArrowIcon from '@/components/atoms/icons/LeftArrowIcon'
import LoginFormRightIcon from '@/components/atoms/icons/LoginFormRightIcon'
import LoginLockIcon from '@/components/atoms/icons/LoginLockIcon'
import LoginUserIcon from '@/components/atoms/icons/LoginUserIcon'
import LogoutIcon from '@/components/atoms/icons/LogoutIcon'
import MagnifyingGlassIcon from '@/components/atoms/icons/MagnifyingGlassIcon'
import MessageIcon from '@/components/atoms/icons/MessageIcon'
import MessageSquareDashedIcon from '@/components/atoms/icons/MessageSquareDashedIcon'
import MoonIcon from '@/components/atoms/icons/MoonIcon'
import PaperClipIcon from '@/components/atoms/icons/PaperClipIcon'
import PencilIcon from '@/components/atoms/icons/PencilIcon'
import PlusIcon from '@/components/atoms/icons/PlusIcon'
import RightArrowIcon from '@/components/atoms/icons/RightArrowIcon'
import SettingIcon from '@/components/atoms/icons/SettingIcon'
import SortIcon from '@/components/atoms/icons/SortIcon'
import StarIcon from '@/components/atoms/icons/StarIcon'
import SuccessIcon from '@/components/atoms/icons/SuccessIcon'
import SunIcon from '@/components/atoms/icons/SunIcon'
import ToggleVerticalIcon from '@/components/atoms/icons/ToggleVerticalIcon'
import ToolIcon from '@/components/atoms/icons/ToolIcon'
import UnderlinePencilIcon from '@/components/atoms/icons/UnderlinePencilIcon'
import UploadIcon from '@/components/atoms/icons/UploadIcon'
import WarningIcon from '@/components/atoms/icons/WarningIcon'
import XMarkIcon from '@/components/atoms/icons/XMarkIcon'

const iconList = [
  { name: 'ArrowPathIcon', component: <ArrowPathIcon /> },
  { name: 'BellIcon', component: <BellIcon /> },
  { name: 'BookmarkIcon', component: <BookmarkIcon /> },
  { name: 'ButtonMenuIcon', component: <ButtonMenuIcon /> },
  { name: 'CheckIcon', component: <CheckIcon /> },
  { name: 'ChevronsLeftIcon', component: <ChevronsLeftIcon /> },
  { name: 'ChevronsRightIcon', component: <ChevronsRightIcon /> },
  { name: 'CloseIcon', component: <CloseIcon /> },
  { name: 'CloseIconGradient', component: <CloseIconGradient /> },
  { name: 'CopyIcon', component: <CopyIcon /> },
  { name: 'DeleteIcon', component: <DeleteIcon /> },
  { name: 'DownArrowFillIcon', component: <DownArrowFillIcon /> },
  { name: 'DownArrowIcon', component: <DownArrowIcon /> },
  { name: 'DownloadIcon', component: <DownloadIcon /> },
  { name: 'EllipsisHorizontalIcon', component: <EllipsisHorizontalIcon /> },
  { name: 'ErrorIcon', component: <ErrorIcon /> },
  { name: 'HeaderUserIcon', component: <HeaderUserIcon /> },
  { name: 'InfoIcon', component: <InfoIcon /> },
  { name: 'LeftArrowIcon', component: <LeftArrowIcon /> },
  { name: 'LoginFormRightIcon', component: <LoginFormRightIcon /> },
  { name: 'LoginLockIcon', component: <LoginLockIcon /> },
  { name: 'LoginUserIcon', component: <LoginUserIcon /> },
  { name: 'LogoutIcon', component: <LogoutIcon /> },
  { name: 'MagnifyingGlassIcon', component: <MagnifyingGlassIcon /> },
  { name: 'MessageIcon', component: <MessageIcon /> },
  { name: 'MessageSquareDashedIcon', component: <MessageSquareDashedIcon /> },
  { name: 'MoonIcon', component: <MoonIcon /> },
  { name: 'PaperClipIcon', component: <PaperClipIcon /> },
  { name: 'PencilIcon', component: <PencilIcon /> },
  { name: 'PlusIcon', component: <PlusIcon /> },
  { name: 'RightArrowIcon', component: <RightArrowIcon /> },
  { name: 'SettingIcon', component: <SettingIcon /> },
  { name: 'SortIcon', component: <SortIcon /> },
  { name: 'StarIcon', component: <StarIcon /> },
  { name: 'SuccessIcon', component: <SuccessIcon /> },
  { name: 'SunIcon', component: <SunIcon /> },
  { name: 'ToggleVerticalIcon', component: <ToggleVerticalIcon /> },
  { name: 'ToolIcon', component: <ToolIcon /> },
  { name: 'UnderlinePencilIcon', component: <UnderlinePencilIcon /> },
  { name: 'UploadIcon', component: <UploadIcon /> },
  { name: 'WarningIcon', component: <WarningIcon /> },
  { name: 'XMarkIcon', component: <XMarkIcon /> },
]

const meta: Meta = {
  title: 'Atoms/Icons',
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj

export const Gallery: Story = {
  render: () => (
    <div className="grid grid-cols-6 gap-6">
      {iconList.map(({ name, component }) => (
        <div
          key={name}
          className="flex flex-col items-center gap-2 rounded-lg border border-gray-200 p-4 dark:border-gray-700"
        >
          <div className="flex h-8 w-8 items-center justify-center">
            {component}
          </div>
          <span className="text-center text-xs text-gray-500 dark:text-gray-400">
            {name}
          </span>
        </div>
      ))}
    </div>
  ),
}

export const DeleteIconWithClick: StoryObj = {
  name: 'DeleteIcon (with onClick)',
  render: () => (
    <DeleteIcon
      onClick={e => {
        e.preventDefault()
        alert('DeleteIcon clicked!')
      }}
      className="fill-gray-400"
    />
  ),
}
