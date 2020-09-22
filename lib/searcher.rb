class Searcher
  def initialize(all_notes, search_params)
    @all_notes = all_notes
    @tags = (search_params[:search_tags] || '').downcase.split(' ')
    @words = (search_params[:search_words] || '').downcase.split(' ')
  end

  def filtered_notes
    @all_notes.select do |note|
      words_from_note = (note.title + ' ' + note.content).downcase.split(' ')
      (@tags - note.tags.map { |tag| tag.downcase }).empty? && (@words - words_from_note).empty?
    end
  end
end
