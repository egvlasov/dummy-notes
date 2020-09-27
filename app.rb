require 'sinatra'
require 'sinatra/reloader'
require 'sinatra/content_for'
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
  # @stats = StatsGenerator.new(store.all)
  erb :index, :layout => !request.xhr?
end

get '/notes/:path' do
  case params['path']
  when 'new'
    erb :new_note, :layout => false
  when 'stats'
    @stats = StatsGenerator.new(store.all)
    erb :stats
  when 'tags'
    @stats = StatsGenerator.new(store.all)
    erb :tags
  else
    @note = store.find(params['path'].to_i)
    # hash with [id] = title
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
  store.save(@note)
  redirect "/notes/#{@note.id}"
  # erb :note_modal, :layout => false
end

get '/notes/:id/edit' do
  @note = store.find(params['id'].to_i)
  erb :edit, :layout => false
end

patch '/notes/:id' do
  @note = store.find(params['id'].to_i)
  @note.title = params['title']
  @note.tags = params['tags'].split
  @note.content = params['content']
  @note.references = params['references'].split
  store.save(@note)
  redirect "/notes/#{params['id']}"
end

delete '/notes/:id' do
  store.delete(params['id'].to_i)
  redirect '/notes'
  # erb :index, :layout => false
end
