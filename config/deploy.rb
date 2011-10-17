set :scm,           :git
set :user,          'rivereo'
set :password,      'tHut5AST'
set :deploy_to,     '/home/rivereo/jetstar'
set :application,   'jetstar'
set :repository,    'git://github.com/jcuervo/jetstar-bp.git'
set :use_sudo,      false
server "96.126.103.64", :app, :web, :db, :primary => true

after "deploy:symlink" do
  run "cd #{current_path} && bundle update rake"
  #run "ln -s /home/rivereo/recruit/shared/conf/database.yml #{current_path}/config/database.yml"
  run "cd #{current_path} &&  rake assets:precompile"
  run "mkdir -p #{current_path}/tmp && touch #{current_path}/tmp/restart.txt"
end

namespace :deploy do
  desc "Restarting mod_rails with restart.txt"
  task :restart do
    run "mkdir -p #{current_path}/tmp && touch #{current_path}/tmp/restart.txt"
  end
  
  desc "Run the migrate rake task."
  task :migrate do
    run "cd #{current_path} && rake RAILS_ENV=production  db:migrate"
  end

  desc "DB reset, and seed"
  task :seed do
    run "cd #{current_path} && rake db:migrate  RAILS_ENV=production && rake db:seed  RAILS_ENV=production"
  end
end

namespace :remote do
  desc "tail production log files"
  task :logs do
    run "tail -f #{current_path}/log/production.log" do |channel, stream, data|
      puts  # for an extra line break before the host name
      puts "#{channel[:host]}: #{data}"
      break if stream == :err    
    end
  end
  
  desc "remote console"
  task :console do
    input = ''
    run "cd #{current_path} && rails c #{ENV['RAILS_ENV']}" do |channel, stream, data|
      next if data.chomp == input.chomp || data.chomp == ''
      print data
      channel.send_data(input = $stdin.gets) if data =~ /^(>|\?)>/
    end
  end
end

after 'deploy', 'deploy:migrate'