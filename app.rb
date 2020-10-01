require 'sinatra'
require 'sinatra/reloader'
require 'note'
require 'note_store'
require 'stats_generator'
require 'searcher'

store = NoteStore.new('notes.yml')

get '/notes' do
  edited_params = params.slice(:search_tags, :search_words)
  if edited_params.empty?
    @notes = store.all
  else
    searcher = Searcher.new(store.all, edited_params)
    @notes = searcher.filtered_notes
  end
  erb :index, :layout => !request.xhr?
end

get '/notes/:path' do
  case params['path']
  when 'new'
    @tags = StatsGenerator.new(store.all).all_tags
    @titles = store.id_and_title(store.all.map { |note| note.id })
    erb :new_note, :layout => false
  when 'tags'
    @stats = StatsGenerator.new(store.all)
    @titles = store.id_and_title(store.all.map { |note| note.id })
    erb :tags, :layout => false
  else
    @note = store.find(params['path'].to_i)
    @titles = store.id_and_title(@note.references)
    erb :note, :layout => false
  end
end

post '/notes' do
  @note = Note.new
  @note.title = params['title']
  @note.tags = params['tags'].split
  @note.content = params['content']
  @note.references = params['references'].split
  store.save(@note, [], @note.references)
  redirect "/notes/#{@note.id}"
end

get '/notes/:id/edit' do
  @note = store.find(params['id'].to_i)
  @tags = StatsGenerator.new(store.all).all_tags
  @titles = store.id_and_title(store.all.map { |note| note.id })
  erb :edit, :layout => false
end

patch '/notes/:id' do
  @note = store.find(params['id'].to_i)
  @note.title = params['title']
  @note.tags = params['tags'].split
  @note.content = params['content']
  old_references = @note.references
  @note.references = params['references'].split
  store.save(@note, old_references, @note.references)
  redirect "/notes/#{params['id']}"
end

delete '/notes/:id' do
  store.delete(params['id'].to_i)
  redirect '/notes'
end
