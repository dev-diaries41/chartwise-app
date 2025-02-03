export const ReceiptSkeleton = () => {
    return (
      <td className="p-0 m-0">
        {/* Wrapper */}
        <table className="w-full max-w-5xl mx-auto text-black table-fixed shadow-md rounded-lg bg-zinc-700 p-4 sm:p-6 lg:p-8">
          <tbody>
            <tr>
              <td className="p-0 m-0">
                <div className="w-full bg-gray-100 p-4 sm:p-6 lg:p-8">
                  <table className="w-full mb-6">
                    <tbody>
                      <tr>
                        <td className="flex justify-between items-center">
                          <div className='w-20 h-6 bg-zinc-700 rounded-full animate-pulse' />
                          <div className='w-20 h-6 bg-zinc-700 rounded-full animate-pulse' />
                        </td>
                      </tr>
                    </tbody>
                  </table>
  
                  <table className="w-full mb-6">
                    <tbody>
                      <tr>
                        <td className="flex flex-wrap gap-4 pb-2">
                          <div className="w-full md:w-1/3">
                            <div className='w-20 h-6 bg-zinc-700 rounded-full animate-pulse' />
                            <div className='w-20 h-6 bg-zinc-700 rounded-full animate-pulse' />
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
  
                  <table className="w-full mb-6">
                    <thead>
                      <tr>
                        <th className="w-1/2 py-2 pl-4 pr-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className='w-20 h-6 bg-zinc-700 rounded-full animate-pulse' />
                        </th>
                        <th className="w-1/6 py-2 pl-4 pr-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className='w-20 h-6 bg-zinc-700 rounded-full animate-pulse' />
                        </th>
                        <th className="w-1/3 py-2 pl-4 pr-6 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className='w-20 h-6 bg-zinc-700 rounded-full animate-pulse' />
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="w-1/2 py-2 pl-4 pr-6 border-b border-gray-200">
                          <div className='w-20 h-6 bg-zinc-700 rounded-full animate-pulse' />
                        </td>
                        <td className="w-1/6 py-2 pl-4 pr-6 border-b border-gray-200">
                          <div className='w-20 h-6 bg-zinc-700 rounded-full animate-pulse' />
                        </td>
                        <td className="w-1/3 py-2 pl-4 pr-6 border-b border-gray-200">
                          <div className='w-20 h-6 bg-zinc-700 rounded-full animate-pulse' />
                        </td>
                      </tr>
                    </tbody>
                  </table>
  
                  <table className="w-full mb-6">
                    <tbody>
                      <tr>
                        <td className="pl-4 pr-6 pt-4 pb-2 border-b border-gray-200">
                          <div className='w-20 h-6 bg-zinc-700 rounded-full animate-pulse' />
                        </td>
                      </tr>
                    </tbody>
                  </table>
  
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        {/* /Wrapper */}
      </td>
    )
  }