export const formatNumber = (num: number, digits = 0) => {
    return Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: digits
    }).format(num)
  }

export const truncteEVMAddr = (addr: string) => ((addr ?? '').length > 4 ? addr.substring(0, 5) + '...' + addr.substring(addr.length - 3) : '')

export const isUrlInvalid = (url: string) => !url ||
 !/^http(s)?/gms.test(url) || url.startsWith('http://localhost') 
 || /^d+\.d+\.d+\.d+\./gms.test(url) || /^http(s)?:\/\/\[/gms.test(url)
