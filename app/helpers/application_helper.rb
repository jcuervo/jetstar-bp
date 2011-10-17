module ApplicationHelper
  def parseDate(date)
    d = date.split('T')
    d = d[0].split('-')
    date = Date.new(d[0].to_i, d[1].to_i, d[2].to_i)
  end
end
