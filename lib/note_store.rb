require 'yaml/store'

class NoteStore
  def initialize(file_name)
    @store = YAML::Store.new(file_name)
  end

  def find(id)
    @store.transaction do
      @store[id]
    end
  end

  def save(note, old_references, new_references)
    @store.transaction do
      @store[note.id] = note
      sync_references(note.id, old_references, new_references)
    end
  end

  def delete(id)
    @store.transaction do
      sync_references(id, @store[id].references, [])
      @store.delete(id)
    end
  end

  def all
    @store.transaction do
      @store.roots.map { |id| @store[id] }
    end
  end

  # method receives array with references and returns hash with [id] = title
  def id_and_title(references)
    @store.transaction do
      titles = Hash.new
      references.each { |reference| titles[reference] = @store[reference.to_i].title }
      titles
    end
  end

  def sync_references(id, old_references, new_references)
    add_references = new_references - old_references
    delete_references = old_references - new_references
    if !(add_references).empty?
      add_references.each do |reference|
        @store[reference.to_i].references << id.to_s
      end
    end
    if !(delete_references).empty?
      delete_references.each do |reference|
        @store[reference.to_i].references.delete(id.to_s)
      end
    end
  end

  def pairs_of_references
    pairs = []
    self.all.each do |note|
      note.references.each do |reference|
        pairs << [note.id, reference.to_i]
      end
    end
    pairs.each { |pair| pairs[pairs.index(pair)] = nil if pairs.include?([pair.last, pair.first]) }
  end

  def notes_per_day
    npd = Hash.new(0)
    self.all.each do |note|
      npd[note.id.to_s.slice(0, 8)] += 1
    end
    npd
  end
end
