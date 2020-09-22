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

  def save(note)
    @store.transaction do
      @store[note.id] = note
    end
  end

  def delete(id)
    @store.transaction do
      @store.delete(id)
    end
  end

  def all
    @store.transaction do
      @store.roots.map { |id| @store[id] }
    end
  end
end
