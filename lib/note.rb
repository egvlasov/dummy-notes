class Note
  attr_accessor :title, :tags, :content, :references
  attr_reader :id

  def initialize
    @id = Time.new.strftime('%Y%m%d%H%M%S').to_i
  end
end
