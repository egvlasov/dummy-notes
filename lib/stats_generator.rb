class StatsGenerator
  def initialize(all_notes)
    @all_notes = all_notes
    @all_tags = []
  end

  def notes_number
    @all_notes.length
  end

  def all_tags
    @all_notes.each { |note| @all_tags += note.tags }
    @all_tags.map { |tag| tag.downcase }.union
  end

  def tags_number
    all_tags.length
  end

  # use this way of double block or set ".each" and ".downcase!" in all_tags method
  def notes_with_tag(tag)
    tag_exists = @all_notes.select do |note|
      note.tags.map { |tag| tag.downcase }.include?(tag)
    end
    tag_exists.map { |note| note.id }
  end
end
