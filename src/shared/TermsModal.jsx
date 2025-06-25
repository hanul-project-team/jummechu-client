import React from 'react'
import { Dialog, DialogPanel } from '@headlessui/react'
import Markdown from 'react-markdown'

const TermsModal = ({ isOpen, setIsOpen, termsMd, termsTitle, name }) => {
  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(prev => ({ ...prev, [name]: false }))}
      className="relative z-50"
    >
      <div className="fixed inset-0 flex w-screen items-center justify-center bg-color-gray-900/50 ">
        <DialogPanel className="max-w-xs sm:max-w-lg space-y-4 rounded-lg bg-white py-6 pe-1">
          <div className="h-120 overflow-y-scroll custom-scrollbar">
            <div className="font-semibold text-xl flex justify-between ps-6 pe-4">
              <span className="cursor-default">{termsTitle}</span>
              <button
                onClick={() => setIsOpen(prev => ({ ...prev, [name]: false }))}
                className="cursor-pointer"
              >
                &times;
              </button>
            </div>
            <div className="outline-hidden cursor-default py-6 ps-6 pe-4">
              <div className="flex flex-col gap-3 text-sm text-color-gray-700 outline-hidden">
                <Markdown>{termsMd}</Markdown>
              </div>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}

export default TermsModal
